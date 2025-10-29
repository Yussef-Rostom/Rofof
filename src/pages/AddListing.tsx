import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addListing, uploadListingImage, clearMessages, updateListing } from "../store/listingSlice";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface IFormInput {
  title: string;
  author: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  imageUrls: string[];
}

export default function AddListing() {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: listingId } = useParams<{ id: string }>();
  const isEditing = !!listingId;

  const { loading, uploadLoading, error, successMessage } = useSelector((state: RootState) => state.listing);
  const { user } = useSelector((state: RootState) => state.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue, watch } = useForm<IFormInput>({
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
          toast({
            title: "Error",
            description: "Failed to fetch listing for editing.",
            variant: "destructive",
          });
          navigate("/listings"); // Redirect if listing not found or error
        }
      };
      fetchListing();
    }
  }, [isEditing, listingId, toast, navigate, reset]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        variant: "success",
      });
      dispatch(clearMessages());
      if (!isEditing) {
        reset();
      }
    }
  }, [error, successMessage, toast, dispatch, isEditing, reset]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const uploadResult = await dispatch(uploadListingImage(formData));
      if (uploadListingImage.fulfilled.match(uploadResult)) {
        setValue("imageUrls", [...imageUrls, uploadResult.payload.imageUrl]);
      } else {
        toast({
          title: "Error",
          description: uploadResult.payload as string,
          variant: "destructive",
        });
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    }
  };

  const handleRemoveImage = () => {
    setValue("imageUrls", []);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: IFormInput) => {
    if (!user?._id) {
      toast({
        title: "Error",
        description: "User not logged in or seller ID not available.",
        variant: "destructive",
      });
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
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-2">
          {isEditing ? "Edit Listing" : "List a New Listing"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isEditing ? "Modify the details of your listing" : "Fill in the details to add your listing to the marketplace"}
        </p>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
            <CardDescription>Provide accurate information to attract buyers</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Listing Images */}
              <div className="space-y-2">
                <Label>Listing Images</Label>
                <div
                  className={`border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors relative ${
                    loading || uploadLoading ? "cursor-not-allowed opacity-50" : "hover:border-primary cursor-pointer"
                  }`}
                  onClick={() => !(loading || uploadLoading) && fileInputRef.current?.click()}
                >
                  {imageUrls.length > 0 ? (
                    <div className="relative w-full h-48 mb-4">
                      <img src={imageUrls[0]} alt="Listing Preview" className="w-full h-full object-cover rounded-md" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/jpeg, image/png"
                  />
                </div>
              </div>

              {/* Title */}
              <Controller
                name="title"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" placeholder="The Great Gatsby" {...field} disabled={loading || uploadLoading} />
                  </div>
                )}
              />

              {/* Author */}
              <Controller
                name="author"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input id="author" placeholder="F. Scott Fitzgerald" {...field} disabled={loading || uploadLoading} />
                  </div>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the listing's condition, edition, and any special features..."
                      rows={4}
                      {...field} disabled={loading || uploadLoading}
                    />
                  </div>
                )}
              />

              {/* Price & Condition Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: true, min: 0.01 }}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input id="price" type="number" step="0.01" placeholder="12.99" {...field} disabled={loading || uploadLoading} />
                    </div>
                  )}
                />

                <Controller
                  name="condition"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition *</Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger disabled={loading || uploadLoading}>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              {/* Category */}
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger disabled={loading || uploadLoading}>
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
                  </div>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={loading || uploadLoading}>
                {loading || uploadLoading ? (isEditing ? "Saving Changes..." : "Listing Listing...") : (isEditing ? "Save Changes" : "List Listing")}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}