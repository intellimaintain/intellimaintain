import { fileLoading, FileLoading, loadStringIncrementally } from "./file.loading";

const fl1: FileLoading = fileLoading ( "src/test1.txt" )
const fl2: FileLoading = fileLoading ( "src/test2.txt" )

describe ( "incremental file loading", () => {
  it ( "should load test1.txt", async () => {
    let { result, newStart } = await loadStringIncrementally ( fl1 ) ( 0 )
    expect ( result.trim () ).toEqual ( "Hello" )
    expect ( newStart ).toEqual ( 7 )
  } )
  it ( "should load test2.txt  incrementally", async () => {
    let { result, newStart } = await loadStringIncrementally ( fl2 ) ( 7 )
    expect ( result ).toEqual ( "World" )
    expect ( newStart ).toEqual ( 12 )
  } )
} )