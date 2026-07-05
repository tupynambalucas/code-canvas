import React, { type ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import { LogoMarkPositive as CodeCanvasLogo } from "@codecanvas-studio/assets/logos";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.logoContainer}>
          <CodeCanvasLogo width={120} height={120} />
        </div>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Start Exploring
          </Link>
          <Link
            className="button button--outline button--secondary button--lg margin-left--md"
            to="/workspaces/extension/intro"
          >
            VS Code Extension
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({ title, description, Svg }: { title: string, description: string, Svg?: React.ComponentType<any> }) {
  return (
    <div className="col col--4">
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <Feature 
            title="Freedom & Customization" 
            description="Take full control of your editor. The CodeCanvas extension enables advanced UI modifications, allowing you to inject CSS and manipulate the VS Code DOM without restrictions."
          />
          <Feature 
            title="Dynamic Backgrounds" 
            description="Personalize your coding environment with stunning dynamic backgrounds. Support for editor, sidebar, panel, and secondary bar independent backgrounds."
          />
          <Feature 
            title="Automatic Theme Integration" 
            description="Seamlessly integrate with CodeCanvas Studio Themes. Change your VS Code theme and watch as backgrounds and configurations are automatically applied in runtime."
          />
        </div>
      </div>
    </section>
  );
}

export default function HomePage(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Docs`}
      description="Dynamic background customization and AI Development Environment for VS Code."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
