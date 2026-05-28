import { client } from './client';

export interface AppSettings {
  buttonText: string;
  title: string;
  description: string;
  appStoreUrl: string;
  playStoreUrl: string;
}

export const getAppSettings = async (): Promise<AppSettings | null> => {
  const query = `*[_type == "appSettings"][0] {
    buttonText,
    title,
    description,
    appStoreUrl,
    playStoreUrl
  }`;

  try {
    const settings = await client.fetch(query);
    return settings || null;
  } catch (error) {
    console.error("Error fetching app settings from Sanity:", error);
    return null;
  }
};