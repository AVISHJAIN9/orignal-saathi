import pandas as pd
try:
    df = pd.read_csv("BIS_Merged_Laboratories_Master.csv", low_memory=False)
    df.to_csv("complete_saathi.csv", index=False)
    print("Dataset successfully renamed and saved as: complete_saathi.csv")
except FileNotFoundError:
    print("Error: The original merged file was not found.")
