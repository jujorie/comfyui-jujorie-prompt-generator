import socket

# Prompt Server Configuration

def get_local_ipv4():
    """
    Get the local IPv4 address of the machine.
    Falls back to localhost if unable to determine.
    """
    try:
        # Create a socket connection to a public DNS (doesn't actually connect)
        # This allows us to detect the local IP that would be used for external traffic
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        # Fallback to localhost if unable to determine IP
        return "localhost"


_LOCAL_IP = get_local_ipv4()
DEFAULT_PROMPT_HOST = f"http://{_LOCAL_IP}:3005"
DEFAULT_PROMPT_SERVER = f"{DEFAULT_PROMPT_HOST}/prompt/closeup?mode=spicy&format=text"
