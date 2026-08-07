import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, '..'))

backend_dirs = [
    'shared', 'gateway', 'document_service', 'ocr_service',
    'layout_service', 'clause_service', 'ner_service',
    'obligation_service', 'risk_service', 'compliance_service',
    'graphrag', 'agent_orchestrator'
]

for d in backend_dirs:
    p = os.path.join(root_dir, 'backend', d, 'src')
    if p not in sys.path:
        sys.path.insert(0, p)

os.environ['APP_SKIP_INFRA'] = 'true'

from gateway.main import app
