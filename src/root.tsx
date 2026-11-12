import React from 'react';
import {Composition} from 'remotion';
import {WifiEpisode} from './wifi-episode';
export const Root: React.FC = () => <Composition id="SoleDeals-Wifi" component={WifiEpisode} durationInFrames={540} fps={30} width={1080} height={1920} />;
