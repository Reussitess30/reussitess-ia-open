/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function Lang() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, []);
  return null;
}
