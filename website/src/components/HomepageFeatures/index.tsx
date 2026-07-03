import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Native performance',
    description: (
      <>
        The sheet host, gestures, snapping, and scroll negotiation run in native
        code, so busy JS work is less likely to affect drag and snap.
      </>
    ),
  },
  {
    title: 'Inline and modal',
    description: (
      <>
        The same native implementation powers both persistent inline sheets and
        modal sheets, presented through a portal in your React tree.
      </>
    ),
  },
  {
    title: 'Bring your own surface',
    description: (
      <>
        You compose the complete sheet surface in React while the library sizes
        it natively to cover the whole sheet as content changes.
      </>
    ),
  },
  {
    title: 'Content-based sizing',
    description: (
      <>
        Dynamic, content-based detents out of the box, with fixed-height and
        programmatic-only snap points when you need them.
      </>
    ),
  },
  {
    title: 'Scrollables just work',
    description: (
      <>
        Regular React Native scrollables coordinate with the sheet natively — no
        bottom-sheet-specific list components or wrapper factories.
      </>
    ),
  },
  {
    title: 'Position tracking',
    description: (
      <>
        Observe the sheet position to drive UI tied to it, on the JS thread or
        as a worklet on the UI thread — without depending on Reanimated.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
