import { useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { PortfolioData } from "@/types/portfolio";

interface CVGeneratorProps {
  data: PortfolioData;
  onGenerate: () => void;
}

const CVTemplate = ({ data }: { data: PortfolioData }) => {
  // Calculate dynamic spacing based on content length
  const layoutConfig = useMemo(() => {
    const experienceCount = data.experience.items.length;
    const educationCount = data.education.items.length;
    const skillsCount = data.skills.categories.length;
    const totalMandatoryItems = experienceCount + educationCount + skillsCount;

    // Estimate space usage (rough calculation)
    const headerSpace = 1.2; // inches
    const summarySpace = 0.8; // inches
    const mandatorySpace = totalMandatoryItems * 0.8; // ~0.8 inches per item
    const usedSpace = headerSpace + summarySpace + mandatorySpace;
    const availableSpace = 11 - 1.5; // Total page minus margins
    const remainingSpace = availableSpace - usedSpace;

    // Dynamic spacing - tighter when content is dense
    let sectionSpacing = "16pt";
    let itemSpacing = "12pt";
    let includeProjects = true;
    let maxProjects = 3;

    if (remainingSpace < 1.5) {
      // Very tight space
      sectionSpacing = "10pt";
      itemSpacing = "8pt";
      maxProjects = 1;
    } else if (remainingSpace < 2.5) {
      // Moderate space
      sectionSpacing = "12pt";
      itemSpacing = "10pt";
      maxProjects = 2;
    } else if (remainingSpace < 0.8) {
      // No space for projects
      includeProjects = false;
      sectionSpacing = "8pt";
      itemSpacing = "6pt";
    }

    return {
      sectionSpacing,
      itemSpacing,
      includeProjects,
      maxProjects,
      fontSize: totalMandatoryItems > 12 ? "10pt" : "11pt",
      lineHeight: totalMandatoryItems > 12 ? "1.2" : "1.3",
    };
  }, [data]);

  return (
    <div
      className="bg-white font-sans text-black print:shadow-none"
      style={{
        width: "8.5in",
        height: "11in",
        margin: "0 auto",
        padding: "0.75in",
        fontSize: layoutConfig.fontSize,
        lineHeight: layoutConfig.lineHeight,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        className="text-center pb-3"
        style={{
          borderBottom: "1pt solid #000",
          marginBottom: layoutConfig.sectionSpacing,
        }}
      >
        <h1
          className="font-bold"
          style={{
            fontSize: "16pt",
            marginBottom: "3pt",
            lineHeight: "1.1",
          }}
        >
          {data.hero.name.toUpperCase()}
        </h1>
        <h2
          style={{
            fontSize: "12pt",
            fontWeight: "600",
            marginBottom: "6pt",
            lineHeight: "1.1",
          }}
        >
          {data.hero.title}
        </h2>
        <div
          className="flex justify-center items-center text-center"
          style={{
            fontSize: "10pt",
            gap: "12pt",
          }}
        >
          <span>{data.contact.email}</span>
          <span>•</span>
          <span>{data.contact.phone}</span>
          <span>•</span>
          <span>{data.contact.location}</span>
        </div>
      </header>

      {/* Professional Summary */}
      <section
        style={{
          pageBreakInside: "avoid",
          marginBottom: layoutConfig.sectionSpacing,
        }}
      >
        <h3
          className="font-bold pb-1"
          style={{
            fontSize: "12pt",
            borderBottom: "0.5pt solid #333",
            marginBottom: "4pt",
          }}
        >
          PROFESSIONAL SUMMARY
        </h3>
        <p
          style={{
            textAlign: "justify",
            marginBottom: "0",
            lineHeight: "1.2",
          }}
        >
          {data.about.bio.length > 300
            ? data.about.bio.substring(0, 297) + "..."
            : data.about.bio}
        </p>
      </section>

      {/* Experience */}
      <section
        style={{
          pageBreakInside: "avoid",
          marginBottom: layoutConfig.sectionSpacing,
        }}
      >
        <h3
          className="font-bold pb-1"
          style={{
            fontSize: "12pt",
            borderBottom: "0.5pt solid #333",
            marginBottom: "4pt",
          }}
        >
          PROFESSIONAL EXPERIENCE
        </h3>
        {data.experience.items.slice(0, 4).map((job, index) => (
          <div
            key={job.id}
            style={{
              pageBreakInside: "avoid",
              marginBottom:
                index === data.experience.items.slice(0, 4).length - 1
                  ? "0"
                  : layoutConfig.itemSpacing,
            }}
          >
            <div
              className="flex justify-between items-start"
              style={{ marginBottom: "2pt" }}
            >
              <div>
                <h4
                  className="font-semibold"
                  style={{
                    fontSize: layoutConfig.fontSize,
                    marginBottom: "1pt",
                    lineHeight: "1.1",
                  }}
                >
                  {job.title}
                </h4>
                <p
                  className="font-medium"
                  style={{
                    fontSize: "10pt",
                    marginBottom: "1pt",
                    lineHeight: "1.1",
                  }}
                >
                  {job.company}
                </p>
              </div>
              <span className="font-medium" style={{ fontSize: "10pt" }}>
                {job.duration}
              </span>
            </div>
            <p
              style={{
                textAlign: "justify",
                marginBottom: "2pt",
                fontSize: "10pt",
                lineHeight: "1.15",
              }}
            >
              {job.description.length > 150
                ? job.description.substring(0, 147) + "..."
                : job.description}
            </p>
            <p style={{ fontSize: "10pt", marginBottom: "0" }}>
              <span className="font-semibold">Technologies:</span>{" "}
              {job.technologies.slice(0, 8).join(", ")}
              {job.technologies.length > 8 && "..."}
            </p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section
        style={{
          pageBreakInside: "avoid",
          marginBottom: layoutConfig.sectionSpacing,
        }}
      >
        <h3
          className="font-bold pb-1"
          style={{
            fontSize: "12pt",
            borderBottom: "0.5pt solid #333",
            marginBottom: "4pt",
          }}
        >
          TECHNICAL SKILLS
        </h3>
        {data.skills.categories.map((category, index) => (
          <div
            key={category.id}
            style={{
              marginBottom:
                index === data.skills.categories.length - 1 ? "0" : "3pt",
            }}
          >
            <span className="font-semibold" style={{ fontSize: "10pt" }}>
              {category.name}:
            </span>
            <span style={{ fontSize: "10pt", marginLeft: "6pt" }}>
              {category.skills.slice(0, 12).join(", ")}
              {category.skills.length > 12 && "..."}
            </span>
          </div>
        ))}
      </section>

      {/* Education */}
      <section
        style={{
          pageBreakInside: "avoid",
          marginBottom: layoutConfig.includeProjects
            ? layoutConfig.sectionSpacing
            : "0",
        }}
      >
        <h3
          className="font-bold pb-1"
          style={{
            fontSize: "12pt",
            borderBottom: "0.5pt solid #333",
            marginBottom: "4pt",
          }}
        >
          EDUCATION
        </h3>
        {data.education.items.map((edu, index) => (
          <div
            key={edu.id}
            style={{
              pageBreakInside: "avoid",
              marginBottom:
                index === data.education.items.length - 1 ? "0" : "6pt",
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4
                  className="font-semibold"
                  style={{
                    fontSize: layoutConfig.fontSize,
                    marginBottom: "1pt",
                    lineHeight: "1.1",
                  }}
                >
                  {edu.degree}
                </h4>
                <p
                  style={{
                    fontSize: "10pt",
                    marginBottom: edu.description ? "1pt" : "0",
                    lineHeight: "1.1",
                  }}
                >
                  {edu.school}
                </p>
                {edu.description && (
                  <p
                    style={{
                      fontSize: "10pt",
                      marginBottom: "0",
                      lineHeight: "1.1",
                    }}
                  >
                    {edu.description.length > 100
                      ? edu.description.substring(0, 97) + "..."
                      : edu.description}
                  </p>
                )}
              </div>
              <span style={{ fontSize: "10pt" }}>{edu.duration}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Projects - Only if there's space */}
      {layoutConfig.includeProjects && (
        <section style={{ pageBreakInside: "avoid" }}>
          <h3
            className="font-bold pb-1"
            style={{
              fontSize: "12pt",
              borderBottom: "0.5pt solid #333",
              marginBottom: "4pt",
            }}
          >
            NOTABLE PROJECTS
          </h3>
          {data.projects.items
            .slice(0, layoutConfig.maxProjects)
            .map((project, index) => (
              <div
                key={project.id}
                style={{
                  pageBreakInside: "avoid",
                  marginBottom:
                    index ===
                    data.projects.items.slice(0, layoutConfig.maxProjects)
                      .length -
                      1
                      ? "0"
                      : "6pt",
                }}
              >
                <h4
                  className="font-semibold"
                  style={{
                    fontSize: layoutConfig.fontSize,
                    marginBottom: "1pt",
                    lineHeight: "1.1",
                  }}
                >
                  {project.title}
                </h4>
                <p
                  style={{
                    fontSize: "10pt",
                    marginBottom: "2pt",
                    textAlign: "justify",
                    lineHeight: "1.15",
                  }}
                >
                  {project.description.length > 120
                    ? project.description.substring(0, 117) + "..."
                    : project.description}
                </p>
                <p style={{ fontSize: "10pt", marginBottom: "0" }}>
                  <span className="font-semibold">Technologies:</span>{" "}
                  {project.technologies.slice(0, 6).join(", ")}
                  {project.technologies.length > 6 && "..."}
                </p>
              </div>
            ))}
        </section>
      )}
    </div>
  );
};

export default function CVGenerator({ data, onGenerate }: CVGeneratorProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${data.hero.name.replace(/\s+/g, "_")}_CV`,
    onAfterPrint: onGenerate,
    pageStyle: `
      @page {
        size: letter;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        * {
          box-shadow: none !important;
        }
      }
    `,
  });

  return (
    <>
      <div className="hidden print:block">
        <div ref={componentRef}>
          <CVTemplate data={data} />
        </div>
      </div>

      {/* Preview for development - remove in production */}
      <div
        className="block print:hidden border border-gray-300 shadow-lg mx-auto"
        style={{ width: "8.5in" }}
      >
        <CVTemplate data={data} />
      </div>

      <div className="text-center mt-6 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Print CV
        </button>
      </div>
    </>
  );
}
