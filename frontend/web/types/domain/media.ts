export type MediaType = 'image' | 'document';

export interface MediaAsset {
  id: string;
  ownerType: string;
  ownerId: string;
  type: MediaType;
  url: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  checksum: string;
  createdAt: string;
}
