import { fileDAO } from "../../../../Dao/FileDAO";
import { FileRowMapper } from "../../../../Dao/RowMapper/FileRowMapper";
import { IFile } from "../../../../model/file.model";
import { FileDTO } from "../../../../schema/chat/FileDTOSchema";

class FileService {
  async getFileById(fileId: string): Promise<FileDTO | null> {
    try {
      const fileArr: IFile[] = [];

      await fileDAO.find(
        {
          fileId,
        },
        new FileRowMapper((file) => {
          fileArr.push(file.toObject());
        })
      );

      return fileArr.length ? this.convertIChatRoomToDTO(fileArr[0]) : null;
    } catch (err) {
      throw err;
    }
  }

  //function overloads
  convertIChatRoomToDTO(file: IFile): FileDTO;
  convertIChatRoomToDTO(file: IFile[]): FileDTO[];

  //function implementations
  convertIChatRoomToDTO(file: IFile | IFile[]): FileDTO | FileDTO[] {
    if (Array.isArray(file)) {
      return file.map(this.convertSingleChatRoomToDTO);
    } else {
      return this.convertSingleChatRoomToDTO(file);
    }
  }
  private convertSingleChatRoomToDTO(file: IFile): FileDTO {
    return file;
  }
}

const fileService = new FileService();
export { fileService };
