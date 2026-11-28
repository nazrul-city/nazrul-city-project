export type TPodcast = {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  duration: string;
  orderPos: number;
  published: boolean;
  clientName?: string | null;
  clientDesignation?: string | null;
  projectName?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
