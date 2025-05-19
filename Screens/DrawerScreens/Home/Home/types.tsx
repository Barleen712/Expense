import StackParamList from "../../../../Navigation/StackList";
import { StackNavigationProp } from "@react-navigation/stack";
export type Homeprop = StackNavigationProp<StackParamList, "MainScreen">;

export interface Props {
  navigation: Homeprop;
}
type Transaction = {
  Date: string; // Or `Date` if you're already parsing it
  amount: number;
  moneyCategory: string;
  [key: string]: any;
};
