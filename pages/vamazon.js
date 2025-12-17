export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/amazon',
      permanent: true
    }
  };
}
export default function VAmazonRedirect() { return null; }
