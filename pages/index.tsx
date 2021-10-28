import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>365 days X</title>
        <meta name="description" content="My 365 days Exploring js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {/* add effect to animate ancor color */}
          365 days <a href="https://nextjs.org">Xploring</a>
        </h1>
        <p className={styles.description}>
          Exporing javascript and various libraries
        </p>
      </main>
      <footer className={styles.footer}>
        <div className={styles.handles}>
          <a href="#">@onifs</a>
          <span className={styles.mx1}>.</span>
          <a href="#">github</a>
          <span className={styles.mx1}>.</span>
          <a href="#">twitter</a>
        </div>
        <div className={styles.date}> 2021/10/28 - Ongoing </div>
      </footer>
    </div>
  );
};

export default Home;
