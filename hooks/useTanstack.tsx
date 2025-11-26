import { useQueryClient } from "@tanstack/react-query";

interface IUseTanstackProps {}
interface IUseTanstackReturnTypes {
  invalidateQueries: (queryKey: any) => void;
}

const useTanstack: IUseTanstackProps = (): IUseTanstackReturnTypes => {
  const queryClient = useQueryClient();
  return {
    invalidateQueries: (queryKey: any) => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
};

export default useTanstack;
