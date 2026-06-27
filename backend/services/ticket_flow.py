ticket_sessions = {}


def get_session(session_id: str):
    if session_id not in ticket_sessions:
        ticket_sessions[session_id] = {
            "mode": "normal",
            "step": None,
            "ticket_data": {}
        }
    return ticket_sessions[session_id]


def reset_session(session_id: str):
    ticket_sessions[session_id] = {
        "mode": "normal",
        "step": None,
        "ticket_data": {}
    }
