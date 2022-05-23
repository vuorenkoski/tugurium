import Text from "./Text";
import useGetUser from "../hooks/useGetUser";

const Current = () => {
  const { user } = useGetUser();

  //   const { isLoading, data } = usePromise(() => authStorage.getAccessToken(), {
  //     resolve: true,
  //   });

  console.log(user);

  return <Text> lämpötilat nyt</Text>;
};

export default Current;
