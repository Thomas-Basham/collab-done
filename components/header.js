import Link from "next/link";

export default function Header({ session, signOut }) {
  console.log(session);

  return (
    <header>
      {" "}
      <nav>
        <Link href="/">
          <a>
            <h3>COLLAB DONE </h3>
          </a>
        </Link>{" "}
        <div className="actions">
          {session ? (
            <>
              <a onClick={signOut()}>
                <h3>Sign Out &rarr;</h3>
              </a>
              <Link href="/profile">
                <a>
                  <h3>Profile &rarr;</h3>
                </a>
              </Link>
              <Link href="/upload-song">
                <a>
                  <h3>Upload &rarr;</h3>
                </a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup">
                <a>
                  <h3>Sign Up &rarr;</h3>
                </a>
              </Link>

              <Link href="/login">
                <a>
                  <h3>Login &rarr;</h3>
                </a>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
