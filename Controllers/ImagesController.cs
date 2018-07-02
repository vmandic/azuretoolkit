using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using azuretoolkit.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;

namespace azuretoolkit.Controllers
{
    [Route ("api/[controller]")]
    public class ImagesController : Controller
    {
        private readonly AzureToolkitContext _context;
        private CloudBlobContainer _container;
        public ImagesController (IConfiguration config, AzureToolkitContext context)
        {
            _context = context;
            var san = config["azure:san"];
            var sanAccessKey = config["azure:sanAccessKey"];

            CloudStorageAccount storageAccount = new CloudStorageAccount (
                new StorageCredentials (san, sanAccessKey), true);

            // Create a blob client.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient ();
            _container = blobClient.GetContainerReference ("savedimages");
        }

        [HttpPost]
        public async Task<IActionResult> PostImage ([FromBody] ImagePostRequest request)
        {
            //Upload Image
            CloudBlockBlob blockBlob = _container.GetBlockBlobReference ($"{request.Id}.{request.EncodingFormat}");

            HttpWebRequest aRequest = (HttpWebRequest) WebRequest.Create (request.URL);
            HttpWebResponse aResponse = (await aRequest.GetResponseAsync ()) as HttpWebResponse;

            var stream = aResponse.GetResponseStream ();
            await blockBlob.UploadFromStreamAsync (stream);
            stream.Dispose ();

            //Save metadata
            var savedImage = new SavedImage ();
            savedImage.UserId = request.UserId;
            savedImage.Description = request.Description;
            savedImage.StorageUrl = blockBlob.Uri.ToString ();
            savedImage.Tags = new List<SavedImageTag> ();

            foreach (var tag in request.Tags)
            {
                savedImage.Tags.Add (new SavedImageTag () { Tag = tag });
            }

            _context.Add (savedImage);
            _context.SaveChanges ();

            return Ok ();
        }
    }

    public class ImagePostRequest
    {
        public string UserId { get; set; }
        public string Description { get; set; }
        public string[] Tags { get; set; }
        public string URL { get; set; }
        public string Id { get; set; }
        public string EncodingFormat { get; set; }
    }
}