import sys
import os

# Add m to sys.path so M2 and m3 can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import M2
sys.modules['m2'] = M2

try:
    import M2.chunker as _chunker
    sys.modules['m2.chunker'] = _chunker
except ImportError:
    pass

try:
    import M2.schemas as _schemas
    sys.modules['m2.schemas'] = _schemas
except ImportError:
    pass

try:
    import M2.embedder as _embedder
    sys.modules['m2.embedder'] = _embedder
except ImportError:
    pass

try:
    import M2.config as _config
    sys.modules['m2.config'] = _config
except ImportError:
    pass
