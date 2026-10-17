import Image, { type StaticImageData } from "next/image";
import styles from "./Devices.module.css";

type FrameProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

/** A restrained browser window around a real screenshot. */
export function BrowserFrame({ src, alt, sizes, preload, className, host }: FrameProps & { host?: string }) {
  return (
    <figure className={`${styles.browser} ${className ?? ""}`}>
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        {host && <span className={styles.url}>{host}</span>}
      </div>
      <Image src={src} alt={alt} sizes={sizes} preload={preload} placeholder="blur" className={styles.shot} />
    </figure>
  );
}

/** A phone silhouette around a real mobile screenshot. */
export function PhoneFrame({ src, alt, sizes, preload, className }: FrameProps) {
  return (
    <figure className={`${styles.phone} ${className ?? ""}`}>
      <Image src={src} alt={alt} sizes={sizes} preload={preload} placeholder="blur" className={styles.screen} />
    </figure>
  );
}
