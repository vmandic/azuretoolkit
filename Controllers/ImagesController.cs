using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;

namespace azuretoolkit.Controllers
{
    public class ImagePostRequest
    {
        public string URL { get; set; }
        public string Id { get; set; }
        public string EncodingFormat { get; set; }
    }

    [Route ("api/[controller]")]
    public class ImagesController : Controller
    {
        private CloudBlobContainer _container;
        public ImagesController (IConfiguration config)
        {
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
            CloudBlockBlob blockBlob = _container.GetBlockBlobReference ($"{request.Id}.{request.EncodingFormat}");
            HttpWebRequest aRequest = (HttpWebRequest) WebRequest.Create (request.URL);
            HttpWebResponse aResponse = (await aRequest.GetResponseAsync ()) as HttpWebResponse;
            var stream = aResponse.GetResponseStream ();

            await blockBlob.UploadFromStreamAsync (stream);

            stream.Dispose ();
            return Ok ();
        }
    }
}