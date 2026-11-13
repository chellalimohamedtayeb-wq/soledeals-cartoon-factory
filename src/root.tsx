import React from 'react';
import {Composition} from 'remotion';
import {SyncedWifiMasterV2} from './wifi-lipsync-motion-master';
export const Root: React.FC = () => <Composition id="SoleDeals-Wifi" component={SyncedWifiMasterV2} durationInFrames={540} fps={30} width={1080} height={1920} />;
