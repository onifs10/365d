import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "@blueprintjs/core";

import Styles from "../styles/layout.module.scss";

const Layout: React.FC = ({ children }) => {
  return <div className={Styles.container}>{children}</div>;
};

export const GoHome: React.FC = () => {
  const router = useRouter();
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      router.push("/");
    }
  };
  return (
    <div
      className={Styles.nav}
      tabIndex={0}
      title="go Home"
      onKeyPress={handleKeyPress}
    >
      <Link href="/" passHref>
        <Icon icon="step-backward" size={40} />
      </Link>
    </div>
  );
};

export default Layout;
