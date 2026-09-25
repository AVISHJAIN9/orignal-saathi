
import os
import re
import joblib
import numpy as np
import pandas as pd
import scipy.sparse as sp

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


# ================================================================
# PATHS
# ================================================================

MODEL_DIR = "/kaggle/working/bis_final_model"
SEARCH_DIR = "/kaggle/working/bis_search_engine"


# ================================================================
# LOAD MODEL
# ================================================================

final_svm = joblib.load(
    os.path.join(
        MODEL_DIR,
        "linear_svm_model.joblib"
    )
)

tfidf_final = joblib.load(
    os.path.join(
        MODEL_DIR,
        "tfidf_vectorizer.joblib"
    )
)

label_encoder_final = joblib.load(
    os.path.join(
        MODEL_DIR,
        "label_encoder.joblib"
    )
)


# ================================================================
# LOAD EQUIVALENCE MODEL FEATURES
# ================================================================

categorical_encoder_final = joblib.load(
    os.path.join(
        MODEL_DIR,
        "categorical_encoder.joblib"
    )
)

MODEL_MASTER_PATH = "/kaggle/input/datasets/aditikhare60/bsv-data/bis_standards_master.csv"
MODEL_AUTHORED_PATH = "/kaggle/input/datasets/aditikhare60/bis-all/bis_all_standards_authored_details.csv"

model_master = pd.read_csv(MODEL_MASTER_PATH)
model_authored = pd.read_csv(MODEL_AUTHORED_PATH)


# ================================================================
# LOAD SEARCH ENGINE
# ================================================================

search_matrix = joblib.load(
    os.path.join(
        SEARCH_DIR,
        "bis_search_matrix.joblib"
    )
)

search_vectorizer = joblib.load(
    os.path.join(
        SEARCH_DIR,
        "bis_search_vectorizer.joblib"
    )
)

search_catalogue = pd.read_parquet(
    os.path.join(
        SEARCH_DIR,
        "bis_search_catalogue.parquet"
    )
)


# ================================================================
# SEARCH
# ================================================================

def search_bis(query, top_k=5):

    query = str(query).strip()

    if not query:
        return []

    normalized = query.upper().strip()

    exact_mask = (
        search_catalogue["standardNumber"]
        .astype(str)
        .str.upper()
        .str.strip()
        == normalized
    )

    exact = search_catalogue[exact_mask]

    if len(exact) > 0:
        rows = exact.head(top_k)
    else:

        query_vector = search_vectorizer.transform(
            [query]
        )

        scores = search_matrix.dot(
            query_vector.T
        ).toarray().ravel()

        indices = np.argsort(
            scores
        )[::-1][:top_k]

        rows = search_catalogue.iloc[indices]

    results = []

    for _, row in rows.iterrows():

        results.append({
            "standardNumber": row["standardNumber"],
            "standardName": row["standardName"],
            "department": row["departmentName"],
            "committee": row["sectionalCommitteeName"],
            "type": row["typeOfStandardName"],
            "publishedOn": row["publishedOn"]
        })

    return results


# ================================================================
# CLASSIFY
# ================================================================

def classify_equivalence(text):

    print("DEBUG classify input:", repr(text))

    target = str(text).strip().upper()

    print("DEBUG target:", repr(target))

    # Find the standard in the original BIS training data
    master_match = model_master[
        model_master["IS_number"]
        .astype(str)
        .str.strip()
        .str.upper()
        == target
    ]

    authored_match = model_authored[
        model_authored["is_number"]
        .astype(str)
        .str.strip()
        .str.upper()
        == target
    ]

    if len(master_match) == 0 or len(authored_match) == 0:
        return "Standard not found in the trained BIS dataset"

    master_row = master_match.iloc[0]
    authored_row = authored_match.iloc[0]

    # --------------------------------------------------
    # 1. TF-IDF FEATURES
    # --------------------------------------------------

    text_columns = [
        "IS_title",
        "catalogue_title",
        "superseding_IS",
        "line_1",
        "line_2",
        "line_3",
        "line_4",
        "line_5",
        "line_7",
        "line_8",
        "line_9"
    ]

    text_values = [
        master_row["IS_title"],
        master_row["catalogue_title"],
        master_row["superseding_IS"],
        authored_row["line_1"],
        authored_row["line_2"],
        authored_row["line_3"],
        authored_row["line_4"],
        authored_row["line_5"],
        authored_row["line_7"],
        authored_row["line_8"],
        authored_row["line_9"]
    ]

    combined_text = " ".join(
        "" if pd.isna(x) else str(x)
        for x in text_values
    )

    tfidf_features = tfidf_final.transform([combined_text])

    # --------------------------------------------------
    # 2. CATEGORICAL FEATURES
    # --------------------------------------------------

    categorical_columns = [
        "number_of_revisions",
        "number_of_amendments",
        "aspect",
        "language",
        "reaffirmation_year",
        "technical_department",
        "technical_committee",
        "member_secretary",
        "catalogue_technical_committee",
        "catalogue_aspect",
        "catalogue_withdrawn_status"
    ]

    categorical_values = {}

    for col in categorical_columns:
        value = master_row[col]

        if pd.isna(value):
            value = "MISSING"

        categorical_values[col] = str(value)

    categorical_df = pd.DataFrame(
        [categorical_values],
        columns=categorical_columns
    )

    categorical_features = categorical_encoder_final.transform(
        categorical_df
    )

    # --------------------------------------------------
    # 3. NUMERIC FEATURES
    # --------------------------------------------------

    numeric_columns = [
        "superseding_IS",
        "reaffirmation_year",
        "group",
        "sub_group",
        "sub_sub_group",
        "certification",
        "amendment_count",
        "gazette_document_count",
        "license_count",
        "product_manual_sit_count",
        "laboratory_count",
        "corrigendum_count",
        "catalogue_id",
        "catalogue_amendments"
    ]

    numeric_values = []

    for col in numeric_columns:

        value = pd.to_numeric(
            pd.Series([master_row[col]]),
            errors="coerce"
        ).iloc[0]

        if pd.isna(value):
            value = 0.0

        numeric_values.append(float(value))

    numeric_features = sp.csr_matrix(
        [numeric_values]
    )

    # --------------------------------------------------
    # 4. COMBINE ALL FEATURES
    # --------------------------------------------------

    full_features = sp.hstack(
        [
            tfidf_features,
            categorical_features,
            numeric_features
        ],
        format="csr"
    )

    if full_features.shape[1] != final_svm.n_features_in_:
        raise ValueError(
            f"Feature mismatch: created {full_features.shape[1]}, "
            f"but model expects {final_svm.n_features_in_}"
        )

    # --------------------------------------------------
    # 5. PREDICT
    # --------------------------------------------------

    prediction_id = final_svm.predict(
        full_features
    )[0]

    prediction = label_encoder_final.inverse_transform(
        [prediction_id]
    )[0]

    return prediction


# ================================================================
# GET QUERY
# ================================================================

def get_query(tracker):

    standard_number = tracker.get_slot(
        "standard_number"
    )

    query = tracker.get_slot(
        "query"
    )

    if standard_number:
        return standard_number

    if query:
        return query

    return tracker.latest_message.get(
        "text",
        ""
    )


# ================================================================
# SEARCH ACTION
# ================================================================

class ActionSearchStandard(Action):

    def name(self):
        return "action_search_standard"

    def run(
        self,
        dispatcher,
        tracker,
        domain
    ):

        query = get_query(tracker)

        results = search_bis(
            query,
            top_k=5
        )

        if not results:

            dispatcher.utter_message(
                text="I couldn't find a matching BIS standard."
            )

            return []

        message = "Here are the matching BIS standards:\n\n"

        for r in results:

            message += (
                f"• {r['standardNumber']}\n"
                f"  {r['standardName']}\n"
                f"  Department: {r['department']}\n"
                f"  Committee: {r['committee']}\n"
                f"  Type: {r['type']}\n"
                f"  Published: {r['publishedOn']}\n\n"
            )

        dispatcher.utter_message(
            text=message
        )

        return []


# ================================================================
# STANDARD DETAILS
# ================================================================

class ActionStandardDetails(Action):

    def name(self):
        return "action_standard_details"

    def run(
        self,
        dispatcher,
        tracker,
        domain
    ):

        query = get_query(tracker)

        results = search_bis(
            query,
            top_k=1
        )

        if not results:

            dispatcher.utter_message(
                text="I couldn't find that BIS standard."
            )

            return []

        r = results[0]

        message = (
            f"Standard: {r['standardNumber']}\n"
            f"Name: {r['standardName']}\n"
            f"Department: {r['department']}\n"
            f"Committee: {r['committee']}\n"
            f"Type: {r['type']}\n"
            f"Published: {r['publishedOn']}"
        )

        dispatcher.utter_message(
            text=message
        )

        return []


# ================================================================
# FIELD ACTIONS
# ================================================================

class ActionAskCommittee(Action):

    def name(self):
        return "action_ask_committee"

    def run(self, dispatcher, tracker, domain):

        results = search_bis(
            get_query(tracker),
            top_k=1
        )

        if results:

            dispatcher.utter_message(
                text=(
                    f"The sectional committee is: "
                    f"{results[0]['committee']}"
                )
            )

        else:

            dispatcher.utter_message(
                text="I couldn't find that standard."
            )

        return []


class ActionAskDepartment(Action):

    def name(self):
        return "action_ask_department"

    def run(self, dispatcher, tracker, domain):

        results = search_bis(
            get_query(tracker),
            top_k=1
        )

        if results:

            dispatcher.utter_message(
                text=(
                    f"The department is: "
                    f"{results[0]['department']}"
                )
            )

        else:

            dispatcher.utter_message(
                text="I couldn't find that standard."
            )

        return []


class ActionAskStandardType(Action):

    def name(self):
        return "action_ask_standard_type"

    def run(self, dispatcher, tracker, domain):

        results = search_bis(
            get_query(tracker),
            top_k=1
        )

        if results:

            dispatcher.utter_message(
                text=(
                    f"The standard type is: "
                    f"{results[0]['type']}"
                )
            )

        else:

            dispatcher.utter_message(
                text="I couldn't find that standard."
            )

        return []


class ActionAskPublicationDate(Action):

    def name(self):
        return "action_ask_publication_date"

    def run(self, dispatcher, tracker, domain):

        results = search_bis(
            get_query(tracker),
            top_k=1
        )

        if results:

            dispatcher.utter_message(
                text=(
                    f"The publication date is: "
                    f"{results[0]['publishedOn']}"
                )
            )

        else:

            dispatcher.utter_message(
                text="I couldn't find that standard."
            )

        return []


# ================================================================
# CLASSIFICATION ACTION
# ================================================================

class ActionClassifyEquivalence(Action):

    def name(self):
        return "action_classify_equivalence"

    def run(self, dispatcher, tracker, domain):

        query = get_query(tracker)

        results = search_bis(
            query,
            top_k=1
        )

        if results:

            standard = results[0]

            classification = classify_equivalence(
                standard["standardNumber"]
            )

            dispatcher.utter_message(
                text=(
                    f"Standard: "
                    f"{standard['standardNumber']}\n"
                    f"Predicted degree of equivalence: "
                    f"{classification}"
                )
            )

        else:

            dispatcher.utter_message(
                text="I couldn't find that BIS standard."
            )

        return []
