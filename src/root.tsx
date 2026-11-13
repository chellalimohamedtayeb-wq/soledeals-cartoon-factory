import React from 'react';
import {Composition} from 'remotion';
import {SyncedWifiMaster} from './wifi-lipsync-master';
export const Root: React.FC = () => <Composition id="SoleDeals-Wifi" component={SyncedWifiMaster} durationInFrames={540} fps={30} width={1080} height={1920} />;
