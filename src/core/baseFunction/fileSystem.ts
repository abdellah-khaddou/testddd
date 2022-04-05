import fs from 'fs'
class fileSystem{
    file(){
        return fs
    }
}
export const fileSystemInstance = new fileSystem();