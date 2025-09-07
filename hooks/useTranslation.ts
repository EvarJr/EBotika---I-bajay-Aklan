import { useAppContext } from './useAppContext';

export const useTranslation = () => {
  const { t } = useAppContext();
  return { t };
};
