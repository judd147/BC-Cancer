/**
 * Form data to be sent to the server for image upload.
 *
 * - **Maximum file size:** 5MB
 * - **Allowed file types:** .jpg, .jpeg, .png, .gif
 */
export interface ImageUploadData {
  /**
   * The image file to upload.
   *
   * **Allowed types:** .jpg, .jpeg, .png, .gif
   *
   * @type {File}
   * @example File object representing a JPEG image.
   */
  image: File;
}

/**
 * Response from the server after a successful image upload.
 */
export interface UploadResponse {
  /**
   * Relative URL to the uploaded image.
   *
   * To access the image, prepend the server's base URL to this relative path.
   *
   * **Example:**
   * `http://localhost:3000/{imageUrl}`
   *
   * @type {string}
   * @example "/img/uuid.jpg"
   */
  imageUrl: string;
}
