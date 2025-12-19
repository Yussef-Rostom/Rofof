import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/mockData";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addListing, uploadListingImage, clearMessages, updateListing } from "../store/listingSlice";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";

const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  price: z.preprocess((val) => Number(val), z.number().min(0.01, "Price must be greater than 0")),
  condition: z.string().min(1, "Please select a condition"),
  category: z.string().min(1, "Please select a category"),
  imageUrls: z.array(z.string()).min(1, "Please upload at least one image").max(5, "You can only upload up to 5 images"),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function AddListing() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: listingId } = useParams<{ id: string }>();
  const isEditing = !!listingId;

  const { loading, uploadLoading, error, successMessage } = useSelector((state: RootState) => state.listing);
  const { user } = useSelector((state: RootState) => state.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      price: 0,
      condition: "",
      category: "",
      imageUrls: [],
    },
  });

  const imageUrls = watch("imageUrls");

  useEffect(() => {
    if (isEditing && listingId) {
      const fetchListing = async () => {
        try {
          const response = await api.get(`/listings/${listingId}`);
          const listing = response.data;

          // Ensure we match the form structure
          reset({
            title: listing.title,
            author: listing.author,
            description: listing.description,
            price: listing.price,
            condition: listing.condition,
            category: listing.category,
            imageUrls: listing.imageUrls || [],
          });
        } catch (err) {
          toast.error("Failed to fetch listing for editing");
          navigate("/account/listings");
        }
      };
      fetchListing();
    }
  }, [isEditing, listingId, navigate, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
      if (!isEditing) {
        reset();
      }
    }
  }, [error, successMessage, dispatch, isEditing, reset]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (imageUrls.length >= 5) {
        toast.error("You can only upload up to 5 images");
        return;
      }

      // Basic client-side validation for file size (e.g. 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const uploadResult = await dispatch(uploadListingImage(formData));

      if (uploadListingImage.fulfilled.match(uploadResult)) {
        setValue("imageUrls", [...imageUrls, uploadResult.payload.imageUrl], { shouldValidate: true });
        toast.success("Image uploaded successfully");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setValue(
      "imageUrls",
      imageUrls.filter((_, index) => index !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: ListingFormValues) => {
    if (!user?._id) {
      toast.error("User not logged in or seller ID not available.");
      return;
    }

    const listingData = {
      ...data,
      sellerId: user._id,
    };

    if (isEditing && listingId) {
      const result = await dispatch(updateListing({ id: listingId, listingData }));
      if (updateListing.fulfilled.match(result)) {
        navigate("/account/listings");
      }
    } else {
      const result = await dispatch(addListing(listingData));
      if (addListing.fulfilled.match(result)) {
        navigate("/account/listings");
      }
    }
  };

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container-custom max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-2">
          {isEditing ? "Edit Listing" : "List a New Listing"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isEditing ? "Modify the details of your listing" : "Fill in the details to add your listing to the marketplace"}
        </p>

        <Card className="shadow-elegant border-border/40">
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>Provide accurate information to attract buyers</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Listing Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className={errors.imageUrls ? "text-destructive" : ""}>
                    Listing Images *
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {imageUrls.length} / 5 images
                  </span>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-border group"
                    >
                      <img
                        src={url}
                        alt={`Listing ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveImage(index)}
                          disabled={uploadLoading}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}

                  {/* Add More Images Card */}
                  {imageUrls.length < 5 && (
                    <div
                      className={`relative aspect-square rounded-lg border-2 border-dashed transition-all cursor-pointer ${errors.imageUrls
                          ? "border-destructive/50 bg-destructive/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      onClick={() => !uploadLoading && fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        {uploadLoading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-xs text-muted-foreground font-medium text-center px-2">
                              {imageUrls.length === 0 ? "Add Images" : "Add More"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/jpeg, image/png, image/webp"
                  disabled={uploadLoading}
                />

                {errors.imageUrls && (
                  <p className="text-xs text-destructive">{errors.imageUrls.message}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>Title *</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="title"
                      placeholder="The Great Gatsby"
                      {...field}
                      disabled={loading}
                      className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                  )}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author" className={errors.author ? "text-destructive" : ""}>Author *</Label>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="author"
                      placeholder="F. Scott Fitzgerald"
                      {...field}
                      disabled={loading}
                      className={errors.author ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                  )}
                />
                {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>Description *</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      placeholder="Describe the listing's condition, edition, and any special features..."
                      rows={4}
                      {...field} disabled={loading}
                      className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                  )}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>

              {/* Price & Condition Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className={errors.price ? "text-destructive" : ""}>Price ($) *</Label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="12.99"
                        {...field}
                        disabled={loading}
                        className={errors.price ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                    )}
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className={errors.condition ? "text-destructive" : ""}>Condition *</Label>
                  <Controller
                    name="condition"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                        <SelectTrigger className={errors.condition ? "border-destructive focus:ring-destructive" : ""}>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.condition && <p className="text-xs text-destructive">{errors.condition.message}</p>}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className={errors.category ? "text-destructive" : ""}>Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                      <SelectTrigger className={errors.category ? "border-destructive focus:ring-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading || uploadLoading}>
                {loading || uploadLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Saving Changes..." : "Creating Listing..."}
                  </>
                ) : (
                  isEditing ? "Save Changes" : "Create Listing"
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}