import { useState, useEffect } from 'react';
import { VaultPinAuth } from '../components/VaultPinAuth';
import { VaultEditor } from '../pages/VaultEditor';

export default function VaultEditorProtected() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('vault_pin_authenticated') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  return authenticated
    ? <VaultEditor />
    : <VaultPinAuth onSuccess={() => setAuthenticated(true)} />;
}
