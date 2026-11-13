import React from 'react';
import {Composition} from 'remotion';
import {WifiEpisodeV5} from './wifi-episode-v5';
export const Root: React.FC = () => <Composition id="SoleDeals-Wifi" component={WifiEpisodeV5} durationInFrames={540} fps={30} width={1080} height={1920} />;
