import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import ROUTES from "../Routes";
import React from "react";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>365 days X</title>
        <meta name="description" content="My 365 days Exploring js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h6 className={styles.title}>
          {/* add effect to animate ancor color */}
          365 X
        </h6>
        <p className={styles.description}>
          Exporing javascript and various libraries
        </p>

        <div className={styles.dayLinks}>
          {ROUTES.map((item) => (
            <Link href={item.path} key={item.day} passHref>
              <div
                className={styles.link}
                tabIndex={0}
                title={`${item.name} - ${item.date}`}
                onKeyPress={(event: React.KeyboardEvent<HTMLSpanElement>) => {
                  if (event.key === "Enter") {
                    router.push(item.path);
                  }
                }}
              >
                <span>{item.day}</span>
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.handles}>
          <a href="#">@onifs</a>
          <span className={styles.mx1}>.</span>
          <a href="https://github.com/onifs10/">github</a>
          <span className={styles.mx1}>.</span>
          <a href="https://twitter.com/BasitOnifade/">twitter</a>
        </div>
        {/* make dragable that would be fun to try */}
        <a
          href="https://github.com/onifs10/365d"
          target="_blank"
          rel="noreferrer"
          tabIndex={0}
          title="repository link"
          className={styles.repo}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>

        <div className={styles.date}> 2021/10/28 - Ongoing </div>
      </footer>
    </div>
  );
};

export default Home;
