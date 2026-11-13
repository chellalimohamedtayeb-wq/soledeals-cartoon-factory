import React from 'react';
import {Composition} from 'remotion';
import {WifiEpisodeV3} from './wifi-episode-v3';
export const Root: React.FC = () => <Composition id="SoleDeals-Wifi" component={WifiEpisodeV3} durationInFrames={540} fps={30} width={1080} height={1920} />;
