"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Save, Image as ImageIcon, Link as LinkIcon, Calendar, Code, Smartphone, Monitor, Globe } from "lucide-react";
import { auth } from "../auth/firebase/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { supabase } from "../auth/supabase/supabase";
import { useRouter, useParams } from "next/navigation";

interface ProjectForm {
  title: string;
  description: string;
  platform: string;
  technologies: string[];
  technologyIcons: { [key: string]: string };
  thumbnail: File | null;
  previewImages: File[];
  existingThumbnailUrl: string;
  existingPreviewImageUrls: string[];
  sourceCodeLink: string;
  startDate: string;
  endDate: string;
}

interface ProjectData {
  title: string;
  description: string;
  platform: string;
  technologies: string[];
  technologyIcons: { [key: string]: string };
  thumbnailUrl: string;
  previewImageUrls: string[];
  sourceCodeLink: string;
  startDate: string;
  endDate: string;
}

export default function EditProjectSection() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [formData, setFormData] = useState<ProjectForm>({
    title: "",
    description: "",
    platform: "web",
    technologies: [],
    technologyIcons: {},
    thumbnail: null,
    previewImages: [],
    existingThumbnailUrl: "",
    existingPreviewImageUrls: [],
    sourceCodeLink: "",
    startDate: "",
    endDate: "",
  });
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useParams();
  const db = getFirestore();
  const projectId = params.projectId as string;

  const technologiesList = [
    "React", "Next.js", "Vue.js", "Angular", "Svelte",
    "Node.js", "Express.js", "Django", "Flask", "FastAPI",
    "Supabase", "Firebase", "MongoDB", "PostgreSQL", "MySQL",
    "GraphQL", "TypeScript", "JavaScript", "Kotlin", "Android", "Jetpack Compose",
    "TailwindCSS", "Bootstrap", "Material-UI", "Chakra UI",
    "Redux", "React Query", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
    "Python", "Java", "C#", "Ruby", "PHP", "React Native", "Flutter", "Ionic"
  ];

  const technologyIcons: { [key: string]: string } = {
    React: "/images/skills/react.png",
    "Next.js": "/images/skills/nextjs.png",
    "Vue.js": "/images/skills/vuejs.png",
    Angular: "/images/skills/angular.png",
    Svelte: "/images/skills/svelte.png",
    "Node.js": "/images/skills/nodejs.png",
    "Express.js": "/images/skills/expressjs.png",
    Django: "/images/skills/django.png",
    Flask: "/images/skills/flask.png",
    FastAPI: "/images/skills/fastapi.png",
    Supabase: "/images/skills/supabase.png",
    Firebase: "/images/skills/firebase.png",
    MongoDB: "/images/skills/mongodb.png",
    PostgreSQL: "/images/skills/postgresql.png",
    MySQL: "/images/skills/mysql.png",
    GraphQL: "/images/skills/graphql.png",
    TypeScript: "/images/skills/typescript.png",
    JavaScript: "/images/skills/javascript.png",
    Kotlin: "/images/skills/kotlin.png",
    Android: "/images/skills/android.png",
    "Jetpack Compose": "/images/skills/jetpackcompose.png",
    TailwindCSS: "/images/skills/tailwindcss.png",
    Bootstrap: "/images/skills/bootstrap.png",
    "Material-UI": "/images/skills/materialui.png",
    "Chakra UI": "/images/skills/chakraui.png",
    Redux: "/images/skills/redux.png",
    "React Query": "/images/skills/reactquery.png",
    AWS: "/images/skills/aws.png",
    Azure: "/images/skills/azure.png",
    "Google Cloud": "/images/skills/googlecloud.png",
    Docker: "/images/skills/docker.png",
    Kubernetes: "/images/skills/kubernetes.png",
    Python: "/images/skills/python.png",
    Java: "/images/skills/java.png",
    "C#": "/images/skills/csharp.png",
    Ruby: "/images/skills/ruby.png",
    PHP: "/images/skills/php.png",
    "React Native": "/images/skills/reactnative.png",
    Flutter: "/images/skills/flutter.png",
    Ionic: "/images/skills/ionic.png",
  };

  useEffect(() => {
    if (!projectId) {
      setStatus("Error: Invalid project ID");
      router.push("/dashboard");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const projectRef = doc(db, `users/${firebaseUser.uid}/projects`, projectId);
          const projectSnap = await getDoc(projectRef);
          if (projectSnap.exists()) {
            const projectData = projectSnap.data() as ProjectData;
            setFormData({
              title: projectData.title || "",
              description: projectData.description || "",
              platform: projectData.platform || "web",
              technologies: projectData.technologies || [],
              technologyIcons: projectData.technologyIcons || {},
              thumbnail: null,
              previewImages: [],
              existingThumbnailUrl: projectData.thumbnailUrl || "",
              existingPreviewImageUrls: projectData.previewImageUrls || [],
              sourceCodeLink: projectData.sourceCodeLink || "",
              startDate: projectData.startDate || "",
              endDate: projectData.endDate || "",
            });
          } else {
            setStatus("Error: Project not found");
            router.push("/dashboard");
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? `Error: ${error.message}`
              : `Unexpected error: Unknown error`;
          setStatus(errorMessage);
          router.push("/dashboard");
        }
      } else {
        router.push("/");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, projectId, db]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnologyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    const selectedIcons: { [key: string]: string } = {};
    selected.forEach((tech) => {
      if (technologyIcons[tech]) {
        selectedIcons[tech] = technologyIcons[tech];
      }
    });
    setFormData((prev) => ({
      ...prev,
      technologies: selected,
      technologyIcons: selectedIcons,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    const maxFileSize = 5 * 1024 * 1024;
    const acceptedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (name === "thumbnail" && files[0]) {
      const file = files[0];

      if (!acceptedTypes.includes(file.type)) {
        setStatus("Error: Thumbnail must be PNG or JPEG");
        return;
      }

      if (file.size > maxFileSize) {
        setStatus("Error: Thumbnail file size exceeds 5MB");
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        if (img.width !== 1920 || img.height !== 1080) {
          setStatus("Error: Thumbnail must be 1920x1080 pixels");
        } else {
          setFormData((prev) => ({ ...prev, thumbnail: file }));
        }
        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        setStatus("Error: Invalid thumbnail image");
        URL.revokeObjectURL(objectUrl);
      };
    } else if (name === "previewImages" && files) {
      if (files.length + formData.existingPreviewImageUrls.length > 10) {
        setStatus("Error: Total preview images cannot exceed 10");
        return;
      }
      const validFiles: File[] = [];
      let invalid = false;
      Array.from(files).forEach((file, index) => {
        if (!acceptedTypes.includes(file.type)) {
          setStatus("Error: Preview images must be PNG or JPEG");
          invalid = true;
          return;
        }
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width !== 1920 || img.height !== 1080) {
            setStatus("Error: Preview images must be 1920x1080 pixels");
            invalid = true;
          } else if (file.size > maxFileSize) {
            setStatus("Error: Some preview images exceed 5MB");
            invalid = true;
          } else {
            validFiles.push(file);
          }
          if (validFiles.length + (invalid ? 1 : 0) === files.length) {
            if (!invalid) {
              setFormData((prev) => ({ ...prev, previewImages: validFiles }));
            }
            Array.from(files).forEach((f) =>
              URL.revokeObjectURL(URL.createObjectURL(f))
            );
          }
        };
        img.onerror = () => {
          setStatus("Error: Invalid preview image");
          invalid = true;
          URL.revokeObjectURL(img.src);
        };
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setStatus("Error: Title and description are required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.technologies.length) {
      setStatus("Error: At least one technology must be selected");
      setIsSubmitting(false);
      return;
    }
    if (formData.sourceCodeLink && !/^(https?:\/\/)/i.test(formData.sourceCodeLink)) {
      setStatus("Error: Source code link must be a valid URL");
      setIsSubmitting(false);
      return;
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      setStatus("Error: End date must be after start date");
      setIsSubmitting(false);
      return;
    }
    if (!user) {
      setStatus("Error: User not authenticated");
      setIsSubmitting(false);
      router.push("/");
      return;
    }

    try {
      let thumbnailUrl = formData.existingThumbnailUrl;
      if (formData.thumbnail) {
        const fileExt = formData.thumbnail.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(`thumbnails/${user.uid}/${fileName}`, formData.thumbnail, {
            upsert: true,
          });
        if (error) throw new Error(`Thumbnail upload failed: ${error.message}`);
        thumbnailUrl = supabase.storage
          .from("project-assets")
          .getPublicUrl(data.path).data.publicUrl;
      }

      const previewImageUrls = [...formData.existingPreviewImageUrls];
      for (const image of formData.previewImages) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("project-assets")
          .upload(`previews/${user.uid}/${fileName}`, image, {
            upsert: true,
          });
        if (error) throw new Error(`Preview image upload failed: ${error.message}`);
        previewImageUrls.push(
          supabase.storage.from("project-assets").getPublicUrl(data.path).data.publicUrl
        );
      }

      const projectRef = doc(db, `users/${user.uid}/projects`, projectId);
      await updateDoc(projectRef, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        platform: formData.platform,
        technologies: formData.technologies,
        technologyIcons: formData.technologyIcons,
        thumbnailUrl,
        previewImageUrls,
        sourceCodeLink: formData.sourceCodeLink.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        updatedAt: new Date().toISOString(),
      });

      setStatus("Project updated successfully!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error: An unexpected error occurred";
      setStatus(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-blue-950 to-black">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 via-blue-950 to-black"
      aria-labelledby="edit-project-title"
    >
      <motion.div
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          id="edit-project-title"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
          variants={itemVariants}
        >
          Edit Project
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            {/* Project Details Card */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-700/50"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" /> Project Details
              </h3>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="title"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <Briefcase className="w-5 h-5 text-blue-400" aria-hidden="true" /> Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                  placeholder="Project title"
                  aria-required="true"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <Briefcase className="w-5 h-5 text-blue-400" aria-hidden="true" /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none text-sm sm:text-base"
                  placeholder="Describe your project"
                  aria-required="true"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <label
                  htmlFor="platform"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  {formData.platform === "web" && <Globe className="w-5 h-5 text-blue-400" aria-hidden="true" />}
                  {formData.platform === "mobile" && <Smartphone className="w-5 h-5 text-blue-400" aria-hidden="true" />}
                  {formData.platform === "desktop" && <Monitor className="w-5 h-5 text-blue-400" aria-hidden="true" />}
                  Platform
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                  aria-required="true"
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                </select>
              </motion.div>
            </motion.div>

            {/* Technologies Card */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-700/50"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" /> Technologies
              </h3>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="technologies"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <Code className="w-5 h-5 text-blue-400" aria-hidden="true" /> Technologies
                </label>
                <select
                  id="technologies"
                  name="technologies"
                  multiple
                  value={formData.technologies}
                  onChange={handleTechnologyChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base max-h-40 overflow-y-auto"
                  aria-required="true"
                  aria-describedby="technologies-help"
                >
                  {technologiesList.map((tech) => (
                    <option key={tech} value={tech} className="py-2 px-4">
                      {tech}
                    </option>
                  ))}
                </select>
                <p id="technologies-help" className="text-xs text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple technologies
                </p>
                {formData.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-lg"
                      >
                        <img
                          src={formData.technologyIcons[tech] || "/images/skills/default.png"}
                          alt={`${tech} icon`}
                          className="w-5 h-5"
                          onError={(e) => {
                            e.currentTarget.src = "/images/skills/default.png";
                          }}
                        />
                        <span className="text-gray-200 text-sm">{tech}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Dates and Source Code Card */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-700/50"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" /> Dates & Source
              </h3>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="sourceCodeLink"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <LinkIcon className="w-5 h-5 text-blue-400" aria-hidden="true" /> Source Code Link
                </label>
                <input
                  type="url"
                  id="sourceCodeLink"
                  name="sourceCodeLink"
                  value={formData.sourceCodeLink}
                  onChange={handleChange}
                  maxLength={200}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                  placeholder="https://github.com/your-repo"
                  aria-describedby="source-code-help"
                />
                <p id="source-code-help" className="text-xs text-gray-400 mt-1">
                  Optional: Provide a link to the project source code (e.g., GitHub)
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <label
                  htmlFor="startDate"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <Calendar className="w-5 h-5 text-blue-400" aria-hidden="true" /> Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                  aria-describedby="start-date-help"
                />
                <p id="start-date-help" className="text-xs text-gray-400 mt-1">
                  Optional: Select the project start date
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <label
                  htmlFor="endDate"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <Calendar className="w-5 h-5 text-blue-400" aria-hidden="true" /> End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm sm:text-base"
                  aria-describedby="end-date-help"
                />
                <p id="end-date-help" className="text-xs text-gray-400 mt-1">
                  Optional: Select the project end date
                </p>
              </motion.div>
            </motion.div>

            {/* Images Card */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-700/50"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" /> Images
              </h3>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="thumbnail"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <ImageIcon className="w-5 h-5 text-blue-400" aria-hidden="true" /> Thumbnail
                  (1920x1080, PNG/JPEG)
                </label>
                {formData.existingThumbnailUrl && (
                  <img
                    src={formData.existingThumbnailUrl}
                    alt="Current project thumbnail"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400";
                    }}
                  />
                )}
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 file:bg-blue-600 file:text-white file:rounded-lg file:border-none file:px-4 file:py-2 file:mr-4 hover:file:bg-blue-500 transition-all duration-300 text-sm sm:text-base"
                  aria-describedby="thumbnail-help"
                />
                <p id="thumbnail-help" className="text-xs text-gray-400 mt-1">
                  Upload a 1920x1080 pixel image (PNG or JPEG, max 5MB)
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4">
                <label
                  htmlFor="previewImages"
                  className="flex items-center gap-2 text-gray-200 mb-2 text-sm sm:text-base"
                >
                  <ImageIcon className="w-5 h-5 text-blue-400" aria-hidden="true" /> Preview Images
                  (1920x1080, max 10, PNG/JPEG)
                </label>
                {formData.existingPreviewImageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {formData.existingPreviewImageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/600x400";
                        }}
                      />
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  id="previewImages"
                  name="previewImages"
                  accept="image/png,image/jpeg"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 file:bg-blue-600 file:text-white file:rounded-lg file:border-none file:px-4 file:py-2 file:mr-4 hover:file:bg-blue-500 transition-all duration-300 text-sm sm:text-base"
                  aria-describedby="preview-images-help"
                />
                <p id="preview-images-help" className="text-xs text-gray-400 mt-1">
                  Upload up to 10 images, each 1920x1080 pixels (PNG or JPEG, max 5MB each)
                </p>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="lg:col-span-2 flex justify-center"
              variants={itemVariants}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-md py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-sm sm:text-base"
                variants={itemVariants}
                whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" aria-hidden="true" /> Save Changes
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {status && (
            <motion.p
              className={`lg:col-span-2 text-center text-sm sm:text-base ${
                status.includes("Error") ? "text-red-400" : "text-green-400"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              role="alert"
            >
              {status}
            </motion.p>
          )}
        </form>
      </motion.div>
    </section>
  );
}