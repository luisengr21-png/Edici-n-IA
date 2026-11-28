// Video 5 «¿A qué te dedicas?» rehecho en el estilo collage.
import React from 'react';
import {CollageTrack, Plan} from './Collage';
import plan from './dedicas.json';
export const DedicasCollage: React.FC = () => <CollageTrack plan={plan as unknown as Plan} />;
export const dedicasCollagePlan = plan as unknown as Plan;
