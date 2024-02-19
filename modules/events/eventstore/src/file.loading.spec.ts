import { fileLoading, FileLoading, loadStringIncrementally } from "./file.loading";

const fl1: FileLoading = fileLoading ( "src/test1.txt" )
const fl2: FileLoading = { ...fileLoading ( "src/test2.txt" ), lastFileSize:7 }

describe ( "incremental file loading", () => {
  it ( "should load test1.txt", async () => {
    let { result, fileLoading } = await loadStringIncrementally ( fl1 )
    expect ( result.trim()).toEqual ( "Hello" )
    expect ( fileLoading ).toEqual ( { ...fl1, lastFileSize: 7 } )
  } )
  it ( "should load test2.txt  incrementally", async () => {
    let { result, fileLoading } = await loadStringIncrementally ( fl2 )
    expect ( result ).toEqual ( "World" )
    expect ( fileLoading ).toEqual ( { ...fl2, lastFileSize: 12 } )
  } )
} )