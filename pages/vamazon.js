/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/boutiques',
      permanent: true
    }
  };
}
export default function VAmazonRedirect() { return null; }
