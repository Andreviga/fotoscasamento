export type FilterPreset = {
  id: string;
  label: string;
  transformation: string;
  badge: string;
};

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  version: number;
};

export type PublishPhotoPayload = {
  guestName: string;
  publicId: string;
  filterId: string;
  filterTransformation: string;
};
