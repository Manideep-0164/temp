import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const ToastNotification = ({
  title,
  notificationStatus,
  setNotificationStatus,
  setNotificationData,
}) => {
  const toast = useToast();

  useEffect(() => {
    if (notificationStatus) {
      toast({
        title: title,
        position: "top-right",
        isClosable: true,
      });
      setNotificationStatus(false);
      setNotificationData("");
    }
  }, [notificationStatus]);

  return null;
};

export default ToastNotification;
