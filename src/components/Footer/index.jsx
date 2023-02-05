import React from "react";
import styles from "./footer.module.css";
import TelegramIcon from "@/assets/images/telegram.svg";
import TwitterIcon from "@/assets/images/twitter.svg";

export default function Footer() {
  const socialLinks = [
    {
      icon: TelegramIcon.src,
      url: "https://t.me/deeplearningchain",
    },
    {
      icon: TwitterIcon.src,
      url: "https://twitter.com/DLChainAI",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.content__left}>
          <p className="proxima-reg-17 text-white">&copy;2023 $DLC. All rights reserved.</p>
        </div>
        <div className={styles.content__right}>
          <div className={styles.socials}>
            {socialLinks.map((item, index) => (
              <a href={item.url} key={index} target="_blank" rel="noreferrer nopenner">
                <img src={item.icon} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
