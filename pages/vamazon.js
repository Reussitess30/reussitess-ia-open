export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/boutiques',
      permanent: true
    }
  };
}
export default function VAmazonRedirect() { return null; }
