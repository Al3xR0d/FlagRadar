import { FC } from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { useUserStore } from '@/store/userStore';
import { TextWrapper } from '@/shared/ui/TextWrapper';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PolicyModal: FC<Props> = ({ open, onClose }) => {
  const curRules = useUserStore((store) => store.rules);

  return (
    <>
      <AntdModal
        open={open}
        titleText="Политика, правила и тд..."
        onCancel={onClose}
        top={20}
        width={900}
        footer={<></>}
      >
        <TextWrapper>{curRules}</TextWrapper>
      </AntdModal>
    </>
  );
};
