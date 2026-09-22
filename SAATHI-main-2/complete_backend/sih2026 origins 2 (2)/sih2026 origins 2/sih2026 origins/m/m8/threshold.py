"""
Threshold decision + decline message construction. Both pure functions —
given the same inputs, always return the same decision/message. This
matters for demo day specifically: you want the decline behavior to be
100% predictable and testable, not something that could vary run to run.
"""

from typing import Optional


def should_proceed(confidence: float, threshold: float) -> bool:
    """True if confidence meets or exceeds the configured threshold."""
    return confidence >= threshold


def build_decline_message(
    confidence: float,
    threshold: float,
    helpdesk_url: str,
    helpdesk_phone: Optional[str] = None,
) -> str:
    """
    The exact message shown to the user when confidence is below
    threshold — declines to guess and redirects to the BIS helpdesk
    instead. Pure: same inputs, same message, every time.
    """
    contact = f"the BIS helpdesk ({helpdesk_url}"
    if helpdesk_phone:
        contact += f", {helpdesk_phone}"
    contact += ")"

    return (
        "I don't have enough confidence in the retrieved information to answer this "
        f"accurately (confidence {confidence:.2f}, below the {threshold:.2f} threshold this "
        "system is currently tuned to). Rather than guess, I'd recommend checking with "
        f"{contact} directly, or trying a more specific query — for example, including the "
        "exact IS number if you know it."
    )
