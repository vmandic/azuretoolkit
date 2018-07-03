using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using azuretoolkit.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
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
        private readonly string _searchApiKey;
        private readonly string _searchServiceName;
        private CloudBlobContainer _container;
        public ImagesController (IConfiguration config, AzureToolkitContext context)
        {
            _context = context;
            var san = config["azure:san"];
            var sanAccessKey = config["azure:sanAccessKey"];
            _searchApiKey = config["azure:searchApiKey"];
            _searchServiceName = config["azure:searchServiceName"];

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

        [HttpGet ("{userId}")]
        public IActionResult GetImages (string userID)
        {
            var images = _context.SavedImages.Where (image => image.UserId == userID);
            return Ok (images);
        }

        [HttpPost ("search/{userId}/{term}")]
        public IActionResult SearchImages (string userId, string term)
        {
            var indexClient =
                new SearchIndexClient (_searchServiceName, "description", new SearchCredentials (_searchApiKey));

            var parameters = new SearchParameters () { Filter = $"UserId eq '{userId}'" };
            DocumentSearchResult<SavedImage> results = indexClient.Documents.Search<SavedImage> (term, parameters);

            return Ok (results.Results.Select ((savedImage) => savedImage.Document));
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