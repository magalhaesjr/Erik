// File Input/Output operations for main thread
import { dialog } from 'electron';
import fs from 'fs';
import { Notification } from '../renderer/redux/notifications';

/** Types */
export type FileProps = {
  name?: string;
  filters?: Electron.FileFilter[];
};

export type OutFileProps = {
  outString: string;
} & FileProps;

/**
 * Read data from file
 *
 * If no input filename is provided, the user is prompted to select one
 * @param param0 are FileProps for oppening a file
 * @returns string content of file if read, null if an error is encountered
 */
export const readFile = ({ name, filters }: FileProps): string | null => {
  let filename: string[] | undefined;
  if (!name) {
    filename = dialog.showOpenDialogSync({
      properties: ['openFile'],
      filters,
    });
  } else {
    filename = [name];
  }

  if (!filename) {
    return null;
  }

  // Read file into string
  const outString = fs.readFileSync(filename[0], {
    encoding: 'utf-8',
  });

  // If failed, return null
  if (!outString) {
    return null;
  }

  return outString;
};

/**
 * Writes String content to a file on disk
 *
 * @param param0 are FileProps for the save file
 * @returns Notification indicating success/failure of operation
 */
export const writeFile = ({
  outString,
  name,
  filters,
}: OutFileProps): Notification => {
  // Input check
  if (outString.length === 0) {
    return {
      status: 'error',
      message: 'Output string is empty',
    };
  }

  let filename: string | undefined;
  if (!name) {
    filename = dialog.showSaveDialogSync({
      filters,
    });
  } else {
    filename = name;
  }

  if (!filename) {
    return {
      status: 'info',
      message: 'User cancelled save',
    };
  }

  // Write data
  try {
    fs.writeFile(filename, outString, (err) => {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    return {
      status: 'error',
      message: (err as NodeJS.ErrnoException).message,
    };
  }

  return {
    status: 'success',
    message: 'Successfully wrote file',
  };
};
