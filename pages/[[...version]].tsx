import {
  AnimateLayoutFeature,
  AnimateSharedLayout,
  m as motion,
  MotionConfig,
} from 'framer-motion';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import data from '../data.json';
import { TierList, TierListData } from '../types';

interface TierListViewProps {
  previous: string | null;
  next: string | null;
  version: string;
  tierList: TierList;
}

function CharacterIcon({ character }: { character: string }) {
  return (
    <motion.div
      layout
      className="rounded-full border-2 border-gray-500 bg-gray-500 h-20 w-20 flex overflow-hidden m-1"
    >
      <div className="relative h-20 w-20">
        <img src={`/characters/${character}.png`} />
      </div>
    </motion.div>
  );
}

const TIER_COLORS = new Map<string, string>([
  ['S', 'bg-red-500'],
  ['A', 'bg-green-500'],
  ['B', 'bg-blue-500'],
  ['C', 'bg-indigo-500'],
  ['D', 'bg-purple-500'],
  ['E', 'bg-pink-500'],
]);

function TierListView({
  version,
  tierList,
  previous,
  next,
}: TierListViewProps) {
  return (
    <MotionConfig features={[AnimateLayoutFeature]}>
      <Head>
        <title>Official Smash Ultimate {version} Tier List</title>
      </Head>

      <div className="min-h-screen bg-gray-800 flex flex-col space-y-5 py-10">
        <div className="flex justify-between items-center px-5">
          {previous != null ? (
            <Link href={`/${previous}`}>
              <a className="min-w-max text-blue-500">&laquo; Previous</a>
            </Link>
          ) : (
            <div className="invisible">&laquo; Previous</div>
          )}

          <h1 className="text-3xl px-3 font-semibold text-center text-white">
            Smash Ultimate Version {version} Tier List
          </h1>

          {next != null ? (
            <Link href={`/${next}`}>
              <a className="min-w-max text-blue-500">Next &raquo;</a>
            </Link>
          ) : (
            <div className="invisible">Next &raquo;</div>
          )}
        </div>

        {Object.entries(tierList).map(([name, tier]) => {
          return (
            <div key={name} className="px-5">
              <h2
                className={`w-max px-2 py-1 text-white rounded-t -mb-1 ${TIER_COLORS.get(
                  name
                )}`}
              >
                {name} Tier
              </h2>

              <div className="rounded-b rounded-tr px-2 py-4 bg-gray-600 flex flex-wrap">
                <AnimateSharedLayout>
                  {tier.map((char) => (
                    <CharacterIcon key={char} character={char} />
                  ))}
                </AnimateSharedLayout>
              </div>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tierLists = data as TierListData;

  const versions = Object.keys(tierLists).map((version) => ({
    params: { version: [version] },
  }));

  return {
    paths: [...versions, { params: { version: [] } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TierListViewProps> = async (
  context
) => {
  const tierLists = data as TierListData;
  const allVersions = Object.keys(tierLists);
  let versionList = context.params?.version as string[] | undefined;
  if (!versionList) {
    versionList = [allVersions[allVersions.length - 1]];
  }

  const version = versionList[0];
  const versionIndex = allVersions.indexOf(version);

  const previous = versionIndex === 0 ? null : allVersions[versionIndex - 1];
  const next =
    versionIndex === allVersions.length - 1
      ? null
      : allVersions[versionIndex + 1];

  const tierList = tierLists[version];
  if (!tierList) {
    return { notFound: true };
  }

  return { props: { version, tierList, previous, next } };
};

export default TierListView;
