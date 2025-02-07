import React, { useContext } from "react";
import { useLocation } from "react-router-dom";

export type FeatureFlags = {
  beta: boolean
}

export const FeatureFlagsContext = React.createContext<FeatureFlags | undefined>(undefined);

export const useFeatureFlags = (): FeatureFlags => {
  const answer = useContext(FeatureFlagsContext);
  if (answer === undefined) {
    throw new Error('useFeatureFlags must be used inside a FeatureFlagContext provider');
  }
  return answer;
};

export const FeatureFlagProvider: React.FunctionComponent = ({
                                                               children
                                                             }) => {
  const value = {
    beta: window.location.pathname.startsWith('/beta')
  } as FeatureFlags;
  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}
