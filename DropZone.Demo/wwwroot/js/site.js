"use strict";

var dropZone = null;
Dropzone.autoDiscover = false;

$(document).ready(function () {
    instantiateDropZone();
});

$(function () {

    // upload button
    $('.upload-or-else').on('click',
        function () {
            dropZone.processQueue();
        });



});

function instantiateDropZone() {

    // dropzone uses this is killing me.
    let element = document.getElementById("drop");

    // instantiate dropZone
    dropZone = new Dropzone(
        element, {
        // add common event listeners
        init: function () {

            const zone = this;
            // only start processing when upload button is clicked
            this.autoProcessQueue = false;

            zone.on("drop",
                function (data) {

                });

            zone.on("addedfile",
                function (data) {

                });


            zone.on("processing",
                function () {
                    // when processQueue is fired. this will keep the process running until all files are uploaded.
                    this.options.autoProcessQueue = true;
                });

            zone.on('error',
                function (file, errorMessage) {
                    // handle files that get errors

                });

        },
        // this decided what files are accepted into your dropzone.
        accept: function (file, done) {

            if (file.size === 0) {

                // custom mssg on file when it does not meet your custom criteria.
                done("Empty files will not be uploaded.");
                $(file.previewElement).find(".dz-error-mark").show();

            } else {

                // maybe create a file count to display or combined file size to display here;
                done();
            }
        },
        ignoreHiddenFiles: true,
        url: "/home/uploadChunk", // where chunks are combined and before going into chunksUploaded event below
        params: function (files, xhr, chunk) {
            console.log(chunk);
            if (chunk) {
                return {
                    Uuid: chunk.file.upload.uuid,
                    fileName: chunk.file.name
                };
            }
        },
        maxFileSize: 40000000000, // max individual file size 2gig
        chunking: true, // enable chunking
        forceChunking: true, // forces chunking when file.size < chunkSize
        capture: null,
        parallelChunkUploads: true, //  allows chunks to be uploaded in parallel - true
        autoProcessQueue: false,
        chunkSize: 1000000, // chunk size 1,000,000 bytes (~1MB)
        retryChunks: false, // retry chunks on failure
        timeout: 120000,
        dictDefaultMessage: "Drop documents here or import from",
        parallelUploads: 3,
        retryChunksLimit: 3, // retry maximum of 3 times (default is 3)
        createImageThumbnails: true, //  create thumbnails
        chunksUploaded: function (file, done) {


            $.ajax({
                type: "POST",
                url: "/home/ChunksComplete",
                data: {
                    "fileName": file.name,
                    "uuid": file.upload.uuid
                },
                success: function (data) {
                    done();
                },
                error: function (msg) {
                    // method below sends file and msg to event listener above
                    dropZone._errorProcessing([file], msg.responseText);
                    done();
                }
            });

        }
        // final event after all files have passed chunksUploaded event above
        , queuecomplete: function () {
            // turn off processor to stop files from immediate upload
            this.options.autoProcessQueue = false;
        }

    });
}