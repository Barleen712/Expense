import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_DATA_KEY = "@userData";

export interface CachedUser {
  uid: string;
  pinSet: boolean;
}

export const saveUserData = async (user: CachedUser) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user data to AsyncStorage", error);
  }
};

export const getCachedUser = async (): Promise<CachedUser | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading user data from AsyncStorage", error);
    return null;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing user data from AsyncStorage", error);
  }
};
