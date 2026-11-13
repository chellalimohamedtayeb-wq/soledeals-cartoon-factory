import React from 'react';
import {Composition} from 'remotion';
import {SimpleWifiMaster} from './wifi-simple-master';
export const Root: React.FC = () => <Composition id="SoleDeals-Wifi" component={SimpleWifiMaster} durationInFrames={540} fps={30} width={1080} height={1920} />;
