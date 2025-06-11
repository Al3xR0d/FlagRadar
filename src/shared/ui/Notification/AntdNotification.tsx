import { notification } from 'antd/es';

const successStyle = {
  backgroundColor: '#001f14',
  color: '#00ff9d',
  border: '1px solid #00ff9d',
  boxShadow: '0 0 10px #00ff9d',
};

const errorStyle = {
  backgroundColor: '#1f0000',
  color: '#ff0044',
  border: '1px solid #ff0044',
  boxShadow: '0 0 10px #ff0044',
};

export function AntdNotifySuccess(message: string, description?: string) {
  notification.success({
    message,
    description,
    className: 'notificationSuccess',
    style: successStyle,
  });
}

export function AntdNotifyError(message: string, description?: string) {
  notification.error({
    message,
    description,
    className: 'notificationError',
    style: errorStyle,
  });
}
